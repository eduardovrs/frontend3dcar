export const shortenAddress = (address: string) => {
  const parts = address.split(',');

  const street = parts[0].trim();
  const neighborhood = parts[1].trim();

  const shortedAddress = `${street} - ${neighborhood}`;

  return shortedAddress;
};
