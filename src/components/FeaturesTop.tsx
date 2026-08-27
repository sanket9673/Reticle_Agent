import { motion } from "framer-motion";
import Button from "./Global/Button";
import Header from "./Global/Header";
import Paragraph from "./Global/Paragraph";
import { useEffect, useState } from "react";

const FeaturesTop = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <div className="flex flex-col min-h-screen py-24 w-full overflow-hidden items-center justify-center px4 md:px-12">
      <h1 className="text-[40px] md:text-[48px] lg:text-[56px] font-bold">
        Cool features
      </h1>
      <div className="md:max-w-md max-w-xs">
        <Paragraph
          content="Powerful tools to supercharge your SaaS experience."
          center
        />
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 px-4 overflow-hidden w-full mt-12 items-center justify-center gap-5">
        <motion.div
          initial={loaded ? {} : { opacity: 0, scale: 0.8 }}
          whileInView={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 1, type: "tween" }}
          className="grid grid-cols-2 bg-[#1a1a1a] overflow-hidden rounded-xl w-full items-center justify-center"
        >
          <div className="flex pl-6 pt-5 flex-col h-full justify-between w-full">
            <div>
              <Header content="Credit sending" center={false} />
              <Paragraph
                content="Tailor every element to match your unique needs."
                small
              />
            </div>
            <div className="mb-12">
              <Button content="Get started" secondary />
            </div>
          </div>
          <div className="flex items-center h-full lg:w-full translate-x-20 md:translate-x-0 justify-end">
            <img
              src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/80b020196597901.662255a112416.jpg"
              className="lg:object-fit object-cover object-left lg:object-center h-80 lg:h-96"
              loading="lazy"
              alt="Feature"
            />
          </div>
        </motion.div>
        <motion.div
          initial={loaded ? {} : { opacity: 0, scale: 0.8 }}
          whileInView={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 1, type: "tween" }}
          className="grid grid-cols-2 bg-[#1a1a1a] overflow-hidden rounded-xl w-full items-center justify-center"
        >
          <div className="flex pl-6 pt-5 flex-col h-full justify-between w-full">
            <div>
              <Header content="Scheduling" center={false} />
              <Paragraph
                content="Crafted for elegance and seamless user experience."
                small
              />
            </div>
            <div className="mb-12">
              <Button content="Get started" secondary />
            </div>
          </div>
          <div className="flex items-center h-full lg:w-full translate-x-20 md:translate-x-0 justify-end">
            <img
              src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/a47730196424815.661fb337d873c.jpg"
              className="lg:object-fit object-cover object-left lg:object-center h-80 lg:h-96"
              loading="lazy"
              alt="Feature"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesTop;
