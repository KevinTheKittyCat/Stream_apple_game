import { createFileRoute } from '@tanstack/react-router'
import { HeaderButton } from '@/components/header/Header'
import { FaBars } from 'react-icons/fa'
import { Icon } from '@chakra-ui/react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="App">
      <HeaderButton>
        <Icon as={FaBars} />
      </HeaderButton>
    </div>
  )
}
