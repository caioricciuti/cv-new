import logo from "@/assets/me.jpeg";

function Hero() {
  return (
    <>
      <div className="h-screen max-h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] flex items-center justify-center">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]"></div>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 p-2 m-auto">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              Caio Ricciuti
            </h1>
            <p className="text-lg">
              Data Engineer, Tech Enthusiast, and Open Source Contributor.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Profile"
              className="relative object-cover object-center z-10 rounded-full max-h-56 max-w-56 w-full h-full lg:max-h-96 lg:max-w-96"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;



