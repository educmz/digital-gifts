import Finale from './Finale'
import MemoryAlbum from './MemoryAlbum'

type Props = { onBack: () => void; onTravel: () => void }

// Álbum de recuerdos y despedida.
function Memories({ onBack, onTravel }: Props) {
  return (
    <>
      <MemoryAlbum />
      <Finale onBack={onBack} onTravel={onTravel} />
    </>
  )
}

export default Memories
