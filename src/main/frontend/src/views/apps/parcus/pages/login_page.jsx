import { Button, Input, Link } from "@nextui-org/react"
import StardustPathLogo from "../../../../assets/stardust-path.png"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import Utils from "../../../../utils"
import { useForm } from "react-hook-form"

const LoginPage = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    const promise = axios.post(`${import.meta.env.VITE_BASE_API_URL}/auth/login`, data, {
      withCredentials: true,
    })

    toast.promise(promise, {
      loading: "Mencoba untuk masuk..",
      success: () => "Berhasil masuk!",
      error: (err) => {
        return Utils.capitalizeFirstWord(err.response?.data?.message ?? "Unknown error.")
      },
    })

    try {
      await promise
      navigate("/overview")
    }
    catch (err) {
      console.error("[ON LOGIN]", JSON.stringify(err))
    }
  }

  return (
    <>
      <div className="flex h-screen flex-col justify-center px-8 lg:px-80 xl:px-[32rem]">
        <img
          className="size-20"
          src={StardustPathLogo}
        />

        <p className="mb-1 text-xl font-medium">
          Login to Stardust Path
        </p>

        <p className="mb-4 font-light text-gray-500">
          Illuminate Your Path to Growth
        </p>

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>

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
            Login
          </Button>
        </form>

        <Link
          className="text-sm"
          href="#"
        >
          Forgot password?
        </Link>

        <p className="text-sm">
          Don&apos;t have an account?&nbsp;
          <Link
            className="cursor-pointer text-sm"
            onPress={() => navigate("/register")}
          >
            Sign up
          </Link>

        </p>
      </div>

      <Toaster />
    </>
  )
}

export default LoginPage
