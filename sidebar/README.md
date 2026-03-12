# Sidebar

Sidebar colapsável com grupos de navegação, perfil de usuário e tema escuro neutro (zinc).

## Preview

- Expandida: 252px | Colapsada: 68px
- Tema: dark zinc (zinc-900)
- Ativo: fundo branco com texto escuro
- Suporte a grupos colapsáveis, itens "coming soon" e toggle animado

## Stack

- **Next.js** (App Router) — usa `usePathname` e `Link`
- **Tailwind CSS v4**
- **lucide-react** — ícones

## Uso

```tsx
import { Sidebar } from "@/components/Sidebar";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        userName="João Silva"
        userEmail="joao@email.com"
        workspaceName="Minha Empresa"
        onLogout={() => { /* sua lógica de logout */ }}
      />
      <main className={collapsed ? "ml-[68px]" : "ml-[252px]"}>
        {children}
      </main>
    </div>
  );
}
```

## Props

| Prop               | Tipo        | Descrição                              |
|--------------------|-------------|----------------------------------------|
| `collapsed`        | `boolean`   | Estado atual da sidebar                |
| `onToggleCollapse` | `() => void`| Callback para expandir/colapsar        |
| `userName`         | `string?`   | Nome do usuário                        |
| `userEmail`        | `string?`   | E-mail do usuário                      |
| `workspaceName`    | `string?`   | Nome exibido no topo (default: "Meu Workspace") |
| `onLogout`         | `() => void?`| Callback chamado ao clicar em "Sair" |

## Customização

Para mudar as cores do tema ativo, edite as classes `bg-white text-zinc-900` nos itens ativos.
Para usar outra cor de fundo, troque `bg-zinc-900` no `<aside>`.

## Dependências

```bash
npm install lucide-react
```
