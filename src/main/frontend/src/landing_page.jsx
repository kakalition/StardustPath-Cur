import { Image } from "@nextui-org/react"
import ParcusLogo from "./assets/parcus.png"
import Mesh from "./assets/mesh.png"
import { IconAsterisk } from "@tabler/icons-react"

function LandingPage() {
  return (
    <div className="flex flex-col px-24">
      <div className="flex flex-row items-center justify-between py-4">
        <div className="flex flex-row items-center">
          <Image className="mr-1" src={ParcusLogo} width={42} />
          <h1 className="text-2xl font-semibold">
            Parcus
            <span className="font-normal text-gray-500"> by Stardust Path</span>
          </h1>
        </div>
        <div className="flex flex-row items-center">
          <p className="mr-12 cursor-pointer text-xl font-medium" onClick={() => window.location = `${import.meta.env.VITE_AUTH_URL}/register`}>Register</p>
          <p className="cursor-pointer text-xl font-medium" onClick={() => window.location = `${import.meta.env.VITE_AUTH_URL}/login`}>Login</p>
        </div>
      </div>

      <div className="h-12">&nbsp;</div>

      <Image className="h-56 w-full object-cover" src={Mesh} />

      <div className="h-24">&nbsp;</div>

      <div className="flex flex-col items-center justify-center">
        <IconAsterisk className="mb-4 size-12 stroke-gray-700" />
        <p className="mb-8 text-8xl font-semibold text-gray-700">Uncover Your Spending Patterns</p>
        <p className="mb-24 text-center text-2xl text-gray-700">
          Visualize your spending habits like never before
          <br></br>
          with our interactive heatmap.
        </p>

        <div className="grid grid-cols-12 gap-16 px-36">
          <div className="col-span-4 clear-start flex flex-col">
            <IconAsterisk className="mb-6 size-6 stroke-gray-700" />
            <p className="mb-4 text-xl font-bold text-gray-700">See Your Spending at a Glance</p>
            <p className="text-xl text-gray-700">
              Understand your spending behavior across different times of the day and days of the week.
            </p>
          </div>

          <div className="col-span-4 clear-start flex flex-col">
            <IconAsterisk className="mb-6 size-6 stroke-gray-700" />
            <p className="mb-4 text-xl font-bold text-gray-700">Optimize Your Budget</p>
            <p className="text-xl text-gray-700">
              Allocate your budget effectively by understanding your spending habits.
            </p>
          </div>

          <div className="col-span-4 clear-start flex flex-col">
            <IconAsterisk className="mb-6 size-6 stroke-gray-700" />
            <p className="mb-4 text-xl font-bold text-gray-700">Identify Savings Opportunities</p>
            <p className="text-xl text-gray-700">
              Find areas where you can cut back on unnecessary spending.
            </p>
          </div>

          <div className="col-span-4 clear-start flex flex-col">
            <IconAsterisk className="mb-6 size-6 stroke-gray-700" />
            <p className="mb-4 text-xl font-bold text-gray-700">Easy-to-Understand Visualizations</p>
            <p className="text-xl text-gray-700">
              Our interactive heatmap makes it simple to understand complex spending patterns.
            </p>
          </div>

          <div className="col-span-4 clear-start flex flex-col">
            <IconAsterisk className="mb-6 size-6 stroke-gray-700" />
            <p className="mb-4 text-xl font-bold text-gray-700">Data Privacy and Security</p>
            <p className="text-xl text-gray-700">
              We use industry-standard encryption to protect your information.
            </p>
          </div>

          <div className="col-span-4 clear-start flex flex-col">
            <IconAsterisk className="mb-6 size-6 stroke-gray-700" />
            <p className="mb-4 text-xl font-bold text-gray-700">Effortless Setup and Integration</p>
            <p className="text-xl text-gray-700">
              Get started in minutes with our easy-to-use tool.
            </p>
          </div>

          <div className="h-24">&nbsp;</div>

        </div>
      </div>
    </div>
  )
}

export default LandingPage
