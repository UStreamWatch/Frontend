export const formatAddress = (address: string): string => {
    if (!address || address.length < 10) {
      return address;
    }
    return `${address.substring(0, 5)}...${address.substring(
      address.length - 5
    )}`;
  };
  