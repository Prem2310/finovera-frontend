function PageHeading({ children }) {
  return (
    <h1 className="mb-4 hidden text-2xl font-semibold capitalize lg:block">
      {children}
    </h1>
  );
}

export default PageHeading;
