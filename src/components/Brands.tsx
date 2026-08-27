import { brands } from "../constants/Brand";
import ClientLogos from "./client-logos";
import { motion } from "framer-motion";

const Brands = () => {
  return (
    <div className="h-auto flex justify-center px-4 md:px-12 items-center w-full overflow-hidden flex-col relative">
      <h1 className="font-bold text-xl mb-6">Trusted by these brands:</h1>
      <div className="overflow-hidden bg-black mb-20">
        <div className="grid place-items-center w-full md:max-w-md lg:max-w-3xl">
          <ClientLogos images={brands} />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 ,clipPath:"circle(0% at 50% 50%)"}}
        whileInView={{ opacity: 1, scale: 1,clipPath:" circle(70.5% at 50% 50%)" }}
        transition={{ duration: 0.5, type: "tween" }}
        className="rounded-xl bg-black p-2"
      >
        {/* <img
          // src="https://assets.website-files.com/62bea764d94f5f7e03ba6535/62beab438f3058330f16ff1c_Main%20UI.png"
          src="https://cdn.dribbble.com/userupload/17362417/file/original-5ab2d714d0771c9e0db7b7cd21a0e19e.png?resize=752x&vertical=center"
          alt="UI"
          loading="lazy"
          className="w-full h-full object-cover object-center rounded-md"
        /> */}
        <a href="https://www.behance.net/gallery/120809987/Bolden-Ventures-30" target="_blank">
  <img 
    src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/aaade2120809987.60ba1cb1de971.gif" 
    alt="Bolden Ventures UI Animation" 
    className="w-full h-auto object-cover rounded-md"
  />
</a>

      </motion.div>
    </div>
  );
};

export default Brands;
