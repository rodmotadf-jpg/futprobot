const API_KEY = process.env.API_FOOTBALL_KEY || '74a6034a3a4aa3556afb41cc0f7f048a';
const API_BASE_URL = 'https://v3.football.api-sports.io';

interface Match {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals?: {
    home: number | null;
    away: number | null;
  };
}

interface FixtureStatistics {
  team: {
    id: number;
    name: string;
  };
  statistics: {
    type: string;
    value: string | number | null;
  }[];
}

interface Prediction {
  prediction: string;
  odds: number;
  confidence: number;
  reasoning: string;
}

async function fetchFromAPI(endpoint: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response;
}

export async function getTodayMatches(): Promise<Match[]> {
  const today = new Date().toISOString().split('T')[0];
  return fetchFromAPI(`/fixtures?date=${today}`);
}

export async function getUpcomingMatches(days: number = 7): Promise<Match[]> {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];

  return fetchFromAPI(`/fixtures?from=${start}&to=${end}`);
}

export async function getFixtureStatistics(fixtureId: number): Promise<FixtureStatistics[]> {
  return fetchFromAPI(`/fixtures/statistics?fixture=${fixtureId}`);
}

export async function getFixtureOdds(fixtureId: number): Promise<any> {
  return fetchFromAPI(`/odds?fixture=${fixtureId}`);
}

export async function analyzePrediction(match: Match): Promise<Prediction> {
  const stats = await getFixtureStatistics(match.fixture.id);
  
  const homeStats = stats.find(s => s.team.id === match.teams.home.id);
  const awayStats = stats.find(s => s.team.id === match.teams.away.id);

  const homeWinProbability = calculateWinProbability(homeStats, awayStats);
  const awayWinProbability = calculateWinProbability(awayStats, homeStats);
  const drawProbability = 100 - homeWinProbability - awayWinProbability;

  let prediction = 'DRAW';
  let confidence = drawProbability;
  let reasoning = '';

  if (homeWinProbability > awayWinProbability && homeWinProbability > drawProbability) {
    prediction = 'HOME_WIN';
    confidence = homeWinProbability;
    reasoning = `${match.teams.home.name} possui ${homeWinProbability.toFixed(1)}% de probabilidade de vitória baseado nas estatísticas.`;
  } else if (awayWinProbability > homeWinProbability && awayWinProbability > drawProbability) {
    prediction = 'AWAY_WIN';
    confidence = awayWinProbability;
    reasoning = `${match.teams.away.name} possui ${awayWinProbability.toFixed(1)}% de probabilidade de vitória baseado nas estatísticas.`;
  } else {
    reasoning = `Jogo equilibrado com ${drawProbability.toFixed(1)}% de probabilidade de empate.`;
  }

  const odds = calculateOdds(confidence);

  return {
    prediction,
    odds,
    confidence,
    reasoning,
  };
}

function calculateWinProbability(
  teamStats: FixtureStatistics | undefined,
  opponentStats: FixtureStatistics | undefined
): number {
  if (!teamStats || !opponentStats) {
    return 33.33;
  }

  const getStat = (stats: FixtureStatistics, type: string): number => {
    const stat = stats.statistics.find(s => s.type === type);
    if (!stat || stat.value === null) return 0;
    if (typeof stat.value === 'string') {
      return parseFloat(stat.value.replace('%', '')) || 0;
    }
    return stat.value;
  };

  const shotsOnGoal = getStat(teamStats, 'Shots on Goal');
  const possession = getStat(teamStats, 'Ball Possession');
  const attacks = getStat(teamStats, 'Total attacks');
  
  const opponentShotsOnGoal = getStat(opponentStats, 'Shots on Goal');
  const opponentPossession = getStat(opponentStats, 'Ball Possession');

  let probability = 33.33;

  if (shotsOnGoal > opponentShotsOnGoal) probability += 15;
  if (possession > opponentPossession) probability += 10;
  if (attacks > 0) probability += 10;

  return Math.min(probability, 85);
}

function calculateOdds(confidence: number): number {
  const probability = confidence / 100;
  const odds = 1 / probability;
  return parseFloat(odds.toFixed(2));
}
