export const parentVariant = {
  hidden: {
    opacity: 1
  },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 1
  }
};

export const childVariant = {
  hidden: {
    x: -30,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: 30,
    opacity: 0
  }
};

export const taskCardVariant = {
  hidden: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1
  },
  exit: {
    scale: 0,
    opacity: 0
  }
};
