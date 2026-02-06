declare module '*.svg' {
  const value: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };

  export default value;
}
