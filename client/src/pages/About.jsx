const About = () =>{
    return(
        <div className="h-96 flex justify-center flex-col items-center">
            <h1 className="font-semibold text-2xl text-slate-700">Learn more about the Siva Estate Project.</h1>
            <div className="border border-2 shadow-md md:w-[800px] py-2 md:h-[300px] m-5 h-[250px] flex flex-col justify-center rounded-md bg-gray-100">
                <h1 className="text-center p-5 font-bold text-slate-700">What is Real Estate</h1>
                <p className="px-5 font-semibold text-sm text-slate-500">Real estate is real property that consists of land and improvements, which include buildings, fixtures, roads, structures, and utility systems. Property rights give a title of ownership to the land, improvements, and natural resources such as minerals, plants, animals, water, etc.</p>
            </div>
        </div>
    )
}

export default About