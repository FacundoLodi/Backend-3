import bcrypt from "bcrypt";

const roles = ["user", "admin"];

export const generateMockUsers = async (quantity) => {
  const users = [];

  for (let i = 0; i < quantity; i++) {
    const hashedPassword = await bcrypt.hash("coder123", 10);

    users.push({
      first_name: `User${i + 1}`,
      last_name: `Mock${i + 1}`,
      email: `user${i + 1}@mock.com`,
      age: Math.floor(Math.random() * 40) + 18,
      password: hashedPassword,
      role: roles[Math.floor(Math.random() * roles.length)],
      pets: []
    });
  }

  return users;
};