export const useAnonSession = (): { id: string } => {
  if (typeof localStorage == "undefined") {
    return { id: "server" };
  } else {
    const loaded = localStorage.getItem("anon_auth");
    if (loaded) {
      return { id: loaded };
    } else {
      const random_id = Math.random().toString(36).substring(2, 9);
      localStorage.setItem("anon_auth", random_id);
      return { id: random_id };
    }
  }
};
