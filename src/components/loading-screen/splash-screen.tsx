import { motion } from "framer-motion";

const SplashScreen = () => {
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    initial: { y: "0%" },
    animate: {
      y: ["0%", "100%"],
      transition: {
        duration: 0.5,
        yoyo: Infinity,
      },
    },
  };

  const dotStyle = {
    display: "block",
    width: 8,
    height: 8,
    backgroundColor: "black",
    borderRadius: "50%",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <motion.span style={dotStyle} variants={dotVariants} />
      <motion.span style={{ ...dotStyle, margin: "0 4px" }} variants={dotVariants} />
      <motion.span style={dotStyle} variants={dotVariants} />
    </motion.div>
  );
};

export default SplashScreen;
