const species = ["dog", "cat", "rabbit"];

export const generateMockPets = (quantity) => {
  const pets = [];

  for (let i = 0; i < quantity; i++) {
    pets.push({
      name: `Pet${i + 1}`,
      specie: species[Math.floor(Math.random() * species.length)],
      birthDate: new Date(
        2016 + Math.floor(Math.random() * 8),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
    });
  }

  return pets;
};