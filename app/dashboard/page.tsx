'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, Activity, DollarSign, LogOut, Sparkles } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subscription: {
    status: string;
    planType: string;
  };
}

interface Stats {
  totalAnalyses: number;
  wins: number;
  losses: number;
  pending: number;
  winRate: number;
  totalProfit: number;
}

interface Analysis {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  odds: number;
  confidence: number;
  matchDate: string;
  result?: {
    status: string;
    profit: number;
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, statsRes, analysesRes, matchesRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/analyses/stats'),
        fetch('/api/analyses/list'),
        fetch('/api/matches/today'),
      ]);

      if (!userRes.ok) {
        router.push('/login');
        return;
      }

      const userData = await userRes.json();
      const statsData = await statsRes.json();
      const analysesData = await analysesRes.json();
      const matchesData = matchesRes.ok ? await matchesRes.json() : { matches: [] };

      setUser(userData.user);
      setStats(statsData.stats);
      setAnalyses(analysesData.analyses);
      setMatches(matchesData.matches.slice(0, 10));
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleAnalyze = async (match: any) => {
    try {
      const response = await fetch('/api/analyses/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match }),
      });

      if (!response.ok) throw new Error('Erro ao criar análise');

      toast({
        title: 'Análise criada!',
        description: 'A previsão foi gerada com sucesso.',
      });

      loadData();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FutProBot</h1>
            <p className="text-sm text-gray-600">Olá, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={user?.subscription?.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {user?.subscription?.status === 'ACTIVE' ? 'Premium Ativo' : 'Assinatura Pendente'}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Análises</CardTitle>
              <Activity className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAnalyses || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.winRate || 0}%</div>
              <p className="text-xs text-gray-500">{stats?.wins || 0} vitórias / {stats?.losses || 0} derrotas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Activity className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pending || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
              <DollarSign className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${(stats?.totalProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {stats?.totalProfit?.toFixed(2) || '0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analyses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analyses">Minhas Análises</TabsTrigger>
            <TabsTrigger value="matches">Partidas Disponíveis</TabsTrigger>
          </TabsList>

          <TabsContent value="analyses">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Análises</CardTitle>
                <CardDescription>Suas últimas previsões e resultados</CardDescription>
              </CardHeader>
              <CardContent>
                {analyses.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhuma análise ainda. Comece analisando partidas!</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Partida</TableHead>
                        <TableHead>Liga</TableHead>
                        <TableHead>Previsão</TableHead>
                        <TableHead>Odds</TableHead>
                        <TableHead>Confiança</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyses.map((analysis) => (
                        <TableRow key={analysis.id}>
                          <TableCell className="font-medium">
                            {analysis.homeTeam} vs {analysis.awayTeam}
                          </TableCell>
                          <TableCell>{analysis.league}</TableCell>
                          <TableCell>{analysis.prediction}</TableCell>
                          <TableCell>{analysis.odds}</TableCell>
                          <TableCell>{analysis.confidence}%</TableCell>
                          <TableCell>
                            <Badge variant={
                              analysis.result?.status === 'WIN' ? 'default' :
                              analysis.result?.status === 'LOSS' ? 'destructive' :
                              'secondary'
                            }>
                              {analysis.result?.status || 'PENDING'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle>Partidas de Hoje</CardTitle>
                <CardDescription>Analise partidas e receba previsões</CardDescription>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhuma partida disponível no momento.</p>
                ) : (
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div key={match.fixture.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">
                            {match.teams.home.name} vs {match.teams.away.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {match.league.name} - {new Date(match.fixture.date).toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAnalyze(match)}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analisar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
