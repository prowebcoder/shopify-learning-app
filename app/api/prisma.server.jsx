export const createCustomer = async ({ email, name }) => {
  return await prisma.customer.create({
    data: {
      id: "147852963",
      email: email,
      name: name,
    },
  });
};
