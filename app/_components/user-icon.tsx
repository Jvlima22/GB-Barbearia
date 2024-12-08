"use client"

import { Button } from "./ui/button"
import { LogInIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import { Avatar, AvatarImage } from "./ui/avatar"
import { useSession } from "next-auth/react"

const UserIcon = () => {
  const { data } = useSession()

  return (
    <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
      {data?.user ? (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={data?.user?.image ?? ""} />
          </Avatar>

          <div>
            <p className="font-bold">{data.user.name}</p>
            <p className="text-xs">{data.user.email}</p>
          </div>
        </div>
      ) : (
        <>
          <h2 className="font-bold">Olá, faça seu login!</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon">
                <LogInIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%]">
              <SignInDialog />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
export default UserIcon
