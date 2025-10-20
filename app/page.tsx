import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3, Zap, Shield, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-green-600 text-white">Taxa de Acerto: 87%</Badge>
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            FutProBot - Análises Esportivas Inteligentes
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Bot de análise esportiva automática com integração à API-Football. 
            Previsões personalizadas com taxa de acerto superior a 85%.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Começar Agora - R$ 97/mês
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Target className="w-12 h-12 mb-4 text-green-600" />
                <CardTitle>1. Configure sua Estratégia</CardTitle>
                <CardDescription>
                  Personalize ligas, tipos de aposta, odds mínimas e máximas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-12 h-12 mb-4 text-blue-600" />
                <CardTitle>2. Análise Automática</CardTitle>
                <CardDescription>
                  O bot analisa estatísticas em tempo real e gera previsões
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-12 h-12 mb-4 text-purple-600" />
                <CardTitle>3. Receba Resultados</CardTitle>
                <CardDescription>
                  Acompanhe seus lucros e taxa de acerto no dashboard
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 mb-2 text-yellow-600" />
                <CardTitle>Análises em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                Dados atualizados instantaneamente via API-Football
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 mb-2 text-green-600" />
                <CardTitle>87% de Taxa de Acerto</CardTitle>
              </CardHeader>
              <CardContent>
                Algoritmo comprovado com histórico de sucesso
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-8 h-8 mb-2 text-blue-600" />
                <CardTitle>Disponível 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                Bot automático funcionando sem interrupções
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="w-8 h-8 mb-2 text-red-600" />
                <CardTitle>Estratégias Personalizadas</CardTitle>
              </CardHeader>
              <CardContent>
                Configure filtros de ligas, odds e tipos de aposta
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 mb-2 text-purple-600" />
                <CardTitle>Dashboard Completo</CardTitle>
              </CardHeader>
              <CardContent>
                Gráficos, estatísticas e histórico de análises
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 mb-2 text-green-600" />
                <CardTitle>Controle de Lucro</CardTitle>
              </CardHeader>
              <CardContent>
                Acompanhe ganhos e perdas em tempo real
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Plano Premium</h2>
          <Card className="max-w-md mx-auto border-2 border-green-600">
            <CardHeader>
              <CardTitle className="text-2xl">R$ 97/mês</CardTitle>
              <CardDescription>Acesso completo à plataforma</CardDescription>
            </CardHeader>
            <CardContent className="text-left space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Análises ilimitadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                <span>API-Football em tempo real</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span>Dashboard completo</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                <span>Estratégias personalizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Suporte prioritário</span>
              </div>
              <Link href="/register" className="block mt-6">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Assinar Agora
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Depoimentos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>João Silva</CardTitle>
                <CardDescription>Cliente desde Jan/2024</CardDescription>
              </CardHeader>
              <CardContent>
                "Excelente ferramenta! Minha taxa de acerto aumentou significativamente."
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maria Santos</CardTitle>
                <CardDescription>Cliente desde Fev/2024</CardDescription>
              </CardHeader>
              <CardContent>
                "O bot é muito preciso. Dashboard intuitivo e análises confiáveis."
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pedro Costa</CardTitle>
                <CardDescription>Cliente desde Mar/2024</CardDescription>
              </CardHeader>
              <CardContent>
                "Melhor investimento que fiz. Suporte excelente e resultados reais."
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">FutProBot</h3>
            <p className="text-gray-400 text-sm">
              Análises esportivas inteligentes com tecnologia de ponta.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#recursos">Recursos</Link></li>
              <li><Link href="#planos">Planos</Link></li>
              <li><Link href="#como-funciona">Como Funciona</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#contato">Contato</Link></li>
              <li><Link href="#faq">FAQ</Link></li>
              <li><Link href="#ajuda">Ajuda</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#termos">Termos de Uso</Link></li>
              <li><Link href="#privacidade">Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          © 2025 FutProBot. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
