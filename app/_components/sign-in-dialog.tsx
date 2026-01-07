import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import Image from "next/image"

const SignInDialog = () => {
  const handleLoginWithGoogleClick = () => signIn("google")

  return (
    <div className="flex flex-col gap-6 py-2">
      <DialogHeader className="gap-2">
        <DialogTitle className="text-xl font-extrabold tracking-tight text-white">
          Faça login na plataforma
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-400">
          Conecte-se usando sua conta do Google para agendar seus serviços.
        </DialogDescription>
      </DialogHeader>

      <Button
        variant="outline"
        className="flex w-full items-center justify-center gap-3 rounded-xl border-[#2C2C2C] bg-[#1D1D1D] px-4 py-6 font-bold text-white transition-all hover:bg-[#2C2C2C]"
        onClick={handleLoginWithGoogleClick}
      >
        <Image
          alt="Fazer login com o Google"
          src="/google.svg"
          width={20}
          height={20}
        />
        Continuar com Google
      </Button>
    </div>
  )
}

export default SignInDialog
