const { getProvider } = require("../api/rest/providers");

const provider = getProvider();

const USERNAME = "default-context-user";
const PASSWORD = null;

const seed = async () => {
  const user = await provider.Auth.adminLogin({
    username: USERNAME,
    password: PASSWORD,
  });

  console.info(user);
};

seed();
