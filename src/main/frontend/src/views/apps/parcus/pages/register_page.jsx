import { Button, Input, Link } from "@nextui-org/react"
import StardustPathLogo from "../../../../assets/stardust-path.png"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import Utils from "../../../../utils"

const RegisterPage = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    const promise = axios.post(`${import.meta.env.VITE_BASE_API_URL}/auth/register`, data, {
      withCredentials: true,
    })

    toast.promise(promise, {
      loading: "Mendaftarkan akun..",
      success: () => "Berhasil mendaftarkan akun!",
      error: (err) => {
        return Utils.capitalizeFirstWord(err.response?.data?.message ?? "Unknown error.")
      },
    })

    try {
      await promise

      navigate("/overview")
    }
    catch (err) {
      console.error("[ON REGISTER]", err)
    }
  }

  return (
    <>
      <div className="flex h-screen flex-col justify-center lg:px-80 xl:px-[32rem]">
        <img
          className="size-20"
          src={StardustPathLogo}
        />

        <p className="mb-1 text-xl font-medium">
          Register to Stardust Path
        </p>

        <p className="mb-4 font-light text-gray-500">
          Begin Your Personal Growth Journey
        </p>

        <form className="flex flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="mb-2"
            errorMessage={errors.name?.message}
            isInvalid={errors.name != null}
            isRequired
            label="Nama"
            type="text"
            {...register("name", { required: "Nama wajib diisi." })}
          />

          <Input
            className="mb-2"
            errorMessage={errors.email?.message}
            isInvalid={errors.email != null}
            isRequired
            label="Email"
            type="email"
            {...register("email", { required: "Email wajib diisi." })}
          />

          <Input
            className="mb-2"
            errorMessage={errors.password?.message}
            isInvalid={errors.password != null}
            isRequired
            label="Password"
            type="password"
            {...register("password", { required: "Password wajib diisi." })}
          />

          <Button
            className="mb-4"
            color="primary"
            type="submit"
          >
            Register
          </Button>
        </form>

        <p className="text-sm">
          Already have an account?&nbsp;
          <Link
            className="cursor-pointer text-sm"
            onClick={() => navigate("/login")}
          >
            Login
          </Link>
        </p>

      </div>
      <Toaster />
    </>
  )
}

export default RegisterPage
