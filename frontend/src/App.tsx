import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { useTheme } from './components/theme-provider'
import { Moon, Sun, Github } from 'lucide-react'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`Usuário criado com sucesso! ID: ${data.id}`)
        setFormData({
          name: '',
          email: '',
          document: '',
          password: ''
        })
      } else {
        setMessage(`Erro: ${data.message || 'Falha ao criar usuário'}`)
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header inspired by GitHub */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Github className="h-8 w-8" />
            <span className="text-xl font-semibold">Signup App</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="rounded-full"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <>{window.matchMedia('(prefers-color-scheme: dark)').matches ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content with CSS Grid layout */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Sidebar - similar to GitHub's sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Sobre</h3>
                    <p className="text-sm text-muted-foreground">
                      Sistema de cadastro de usuários com validação completa de dados.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-2">Requisitos</h3>
                    <ul className="text-sm space-y-1">
                      <li className="text-muted-foreground">• Nome completo</li>
                      <li className="text-muted-foreground">• Email válido</li>
                      <li className="text-muted-foreground">• Documento</li>
                      <li className="text-muted-foreground">• Senha forte</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main content area */}
          <div className="lg:col-span-9">
            <Card>
              <CardHeader>
                <CardTitle>Criar nova conta</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo para criar sua conta. Todos os campos são obrigatórios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="João Silva"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="joao@exemplo.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="document">Documento</Label>
                      <Input
                        type="text"
                        id="document"
                        name="document"
                        value={formData.document}
                        onChange={handleChange}
                        placeholder="123.456.789-00"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 8 caracteres"
                        required
                      />
                    </div>
                  </div>

                  {message && (
                    <div className={`p-4 rounded-md text-sm ${
                      message.includes('sucesso') 
                        ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {message}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Ao criar uma conta, você concorda com nossos termos de serviço.
                    </p>
                    <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                      {isLoading ? 'Criando...' : 'Criar conta'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Additional info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Segurança</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Suas informações são criptografadas e armazenadas com segurança.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Suporte</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Precisa de ajuda? Entre em contato com nossa equipe de suporte.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App