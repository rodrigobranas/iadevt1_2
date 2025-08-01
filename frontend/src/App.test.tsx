import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { ThemeProvider } from './components/theme-provider'

// Mock fetch globally
const mockFetch = vi.fn()
window.fetch = mockFetch

// Wrapper component for tests
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>
}

describe('App - Signup Form', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    mockFetch.mockReset()
  })

  describe('Form Rendering', () => {
    it('renders signup form with all 4 required fields', () => {
      render(<App />, { wrapper: AllProviders })
      
      // Check if title is rendered
      expect(screen.getByText(/criar nova conta/i)).toBeInTheDocument()
      
      // Check if all 4 form fields are present
      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/documento/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
      
      // Check if submit button is present
      expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument()
    })

    it('renders all form fields with correct types and attributes', () => {
      render(<App />, { wrapper: AllProviders })
      
      const nameInput = screen.getByLabelText(/nome completo/i)
      const emailInput = screen.getByLabelText(/email/i)
      const documentInput = screen.getByLabelText(/documento/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      
      expect(nameInput).toHaveAttribute('type', 'text')
      expect(nameInput).toHaveAttribute('required')
      expect(nameInput).toHaveAttribute('name', 'name')
      
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('required')
      expect(emailInput).toHaveAttribute('name', 'email')
      
      expect(documentInput).toHaveAttribute('type', 'text')
      expect(documentInput).toHaveAttribute('required')
      expect(documentInput).toHaveAttribute('name', 'document')
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('required')
      expect(passwordInput).toHaveAttribute('name', 'password')
    })
  })

  describe('Form Input Handling', () => {
    it('updates form fields when user types', async () => {
      const user = userEvent.setup()
      render(<App />, { wrapper: AllProviders })
      
      const nameInput = screen.getByLabelText(/nome completo/i)
      const emailInput = screen.getByLabelText(/email/i)
      const documentInput = screen.getByLabelText(/documento/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      
      await user.type(nameInput, 'João Silva')
      await user.type(emailInput, 'joao@example.com')
      await user.type(documentInput, '12345678901')
      await user.type(passwordInput, 'senha123')
      
      expect(nameInput).toHaveValue('João Silva')
      expect(emailInput).toHaveValue('joao@example.com')
      expect(documentInput).toHaveValue('12345678901')
      expect(passwordInput).toHaveValue('senha123')
    })
  })

  describe('Form Submission - Success', () => {
    it('submits form with valid data and shows success message', async () => {
      const user = userEvent.setup()
      
      // Mock successful response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '123' })
      })
      
      render(<App />, { wrapper: AllProviders })
      
      // Fill form
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva')
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
      await user.type(screen.getByLabelText(/documento/i), '12345678901')
      await user.type(screen.getByLabelText(/senha/i), 'senha123')
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /criar conta/i }))
      
      // Check if fetch was called with correct data
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'João Silva',
          email: 'joao@example.com',
          document: '12345678901',
          password: 'senha123'
        })
      })
      
      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/usuário criado com sucesso! id: 123/i)).toBeInTheDocument()
      })
    })

    it('clears form fields after successful submission', async () => {
      const user = userEvent.setup()
      
      // Mock successful response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '123' })
      })
      
      render(<App />, { wrapper: AllProviders })
      
      const nameInput = screen.getByLabelText(/nome completo/i)
      const emailInput = screen.getByLabelText(/email/i)
      const documentInput = screen.getByLabelText(/documento/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      
      // Fill form
      await user.type(nameInput, 'João Silva')
      await user.type(emailInput, 'joao@example.com')
      await user.type(documentInput, '12345678901')
      await user.type(passwordInput, 'senha123')
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /criar conta/i }))
      
      // Wait for form to be cleared
      await waitFor(() => {
        expect(nameInput).toHaveValue('')
        expect(emailInput).toHaveValue('')
        expect(documentInput).toHaveValue('')
        expect(passwordInput).toHaveValue('')
      })
    })
  })

  describe('Error Handling', () => {
    it('shows error message when server returns error response', async () => {
      const user = userEvent.setup()
      
      // Mock error response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Email já está em uso' })
      })
      
      render(<App />, { wrapper: AllProviders })
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva')
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
      await user.type(screen.getByLabelText(/documento/i), '12345678901')
      await user.type(screen.getByLabelText(/senha/i), 'senha123')
      await user.click(screen.getByRole('button', { name: /criar conta/i }))
      
      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/erro: email já está em uso/i)).toBeInTheDocument()
      })
    })

    it('shows generic error message when server returns error without message', async () => {
      const user = userEvent.setup()
      
      // Mock error response without message
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({})
      })
      
      render(<App />, { wrapper: AllProviders })
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva')
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
      await user.type(screen.getByLabelText(/documento/i), '12345678901')
      await user.type(screen.getByLabelText(/senha/i), 'senha123')
      await user.click(screen.getByRole('button', { name: /criar conta/i }))
      
      // Wait for generic error message
      await waitFor(() => {
        expect(screen.getByText(/erro: falha ao criar usuário/i)).toBeInTheDocument()
      })
    })

    it('shows network error message when fetch fails', async () => {
      const user = userEvent.setup()
      
      // Mock network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      
      render(<App />, { wrapper: AllProviders })
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva')
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
      await user.type(screen.getByLabelText(/documento/i), '12345678901')
      await user.type(screen.getByLabelText(/senha/i), 'senha123')
      await user.click(screen.getByRole('button', { name: /criar conta/i }))
      
      // Wait for network error message
      await waitFor(() => {
        expect(screen.getByText(/erro ao conectar com o servidor/i)).toBeInTheDocument()
      })
    })
  })

  describe('Loading State', () => {
    it('shows loading state during form submission', async () => {
      const user = userEvent.setup()
      
      // Mock delayed response
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      mockFetch.mockReturnValueOnce(promise)
      
      render(<App />, { wrapper: AllProviders })
      
      // Fill form
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva')
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
      await user.type(screen.getByLabelText(/documento/i), '12345678901')
      await user.type(screen.getByLabelText(/senha/i), 'senha123')
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /criar conta/i }))
      
      // Check loading state
      expect(screen.getByRole('button', { name: /criando.../i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /criando.../i })).toBeDisabled()
      
      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: async () => ({ id: '123' })
      })
      
      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /criar conta/i })).not.toBeDisabled()
      })
    })

    it('disables submit button during loading', async () => {
      const user = userEvent.setup()
      
      // Mock delayed response
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      mockFetch.mockReturnValueOnce(promise)
      
      render(<App />, { wrapper: AllProviders })
      
      // Fill form
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva')
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
      await user.type(screen.getByLabelText(/documento/i), '12345678901')
      await user.type(screen.getByLabelText(/senha/i), 'senha123')
      
      const submitButton = screen.getByRole('button', { name: /criar conta/i })
      expect(submitButton).not.toBeDisabled()
      
      // Submit form
      await user.click(submitButton)
      
      // Check button is disabled during loading
      const loadingButton = screen.getByRole('button', { name: /criando.../i })
      expect(loadingButton).toBeDisabled()
      
      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: async () => ({ id: '123' })
      })
      
      // Wait for button to be enabled again
      await waitFor(() => {
        const finalButton = screen.getByRole('button', { name: /criar conta/i })
        expect(finalButton).not.toBeDisabled()
      })
    })
  })

  describe('Message Display', () => {
    it('clears previous messages when starting new submission', async () => {
      const user = userEvent.setup()
      
      // First submission - error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Erro inicial' })
      })
      
      render(<App />, { wrapper: AllProviders })
      
      // Fill and submit form first time
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva')
      await user.type(screen.getByLabelText(/email/i), 'joao@example.com')
      await user.type(screen.getByLabelText(/documento/i), '12345678901')
      await user.type(screen.getByLabelText(/senha/i), 'senha123')
      await user.click(screen.getByRole('button', { name: /criar conta/i }))
      
      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/erro: erro inicial/i)).toBeInTheDocument()
      })
      
      // Clear form fields manually for second test
      const nameInput = screen.getByLabelText(/nome completo/i)
      const emailInput = screen.getByLabelText(/email/i)
      const documentInput = screen.getByLabelText(/documento/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      
      await user.clear(nameInput)
      await user.clear(emailInput)
      await user.clear(documentInput)
      await user.clear(passwordInput)
      
      // Second submission - success
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '456' })
      })
      
      // Fill form again
      await user.type(nameInput, 'Maria Santos')
      await user.type(emailInput, 'maria@example.com')
      await user.type(documentInput, '98765432109')
      await user.type(passwordInput, 'senha456')
      await user.click(screen.getByRole('button', { name: /criar conta/i }))
      
      // Wait for success message and check error is gone
      await waitFor(() => {
        expect(screen.getByText(/usuário criado com sucesso! id: 456/i)).toBeInTheDocument()
        expect(screen.queryByText(/erro: erro inicial/i)).not.toBeInTheDocument()
      })
    })

    it('does not show message initially', () => {
      render(<App />, { wrapper: AllProviders })
      
      // Check that no message paragraph is present initially
      expect(screen.queryByText(/usuário criado/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/erro/i)).not.toBeInTheDocument()
    })
  })
})