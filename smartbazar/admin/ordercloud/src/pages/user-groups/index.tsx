import React, { useEffect, useState, useRef } from "react";
import { Auth, Tokens, Configuration } from "ordercloud-javascript-sdk";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import Layout from "@components/layouts/admin";
import { adminOnly } from "@utils/auth-utils";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import UserGroupTable from "@components/userGroup/userGroupTable";

const UserGroups = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [token, setToken] = useState("");
  const apiCalled = useRef(false);

  const clientSecret =
    "aeiTWwmVaocTPcqkEpFiInyNGRdOYHAwomzOn8ID3G3C90fsl0aXVp5zfRqI";
  const clientId = "C37C1808-34A1-4E04-BE1D-D28CD50A1F31";
  const authenticateOrderCloud = async () => {
    try {
      Configuration.Set({
        baseApiUrl: "https://sandboxapi.ordercloud.io",
        timeoutInMilliseconds: 20 * 1000,
      });
      const authResponse = await Auth.ClientCredentials(
        clientSecret,
        clientId,
        ["FullAccess"]
      );

      Tokens.SetAccessToken(authResponse.access_token);
      setToken(authResponse.access_token);
    } catch (error) {
      console.error("Error authenticating OrderCloud:", error);
    }
  };

  const fetchUserGroups = (authToken: any) => {
    try {
      setTimeout(async () => {
        const response = await fetch(
          `https://sandboxapi.ordercloud.io/v1/${API_ENDPOINTS.USERGROUPS}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data && data.Items) {
          setUserGroups(data.Items);
          console.log(data.Items, "items");
        } else {
          console.warn("No items found in response data:", data);
          setUserGroups([]);
        }
      }, 2000);
    } catch (error) {
      console.error("Error fetching user groups:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (!apiCalled.current) {
        apiCalled.current = true;
        await authenticateOrderCloud();
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserGroups(token);
    }
  }, [token]);

  return (
    <div>
      {/* <h5>List of UserGroup</h5> */}
      <UserGroupTable userGroups={userGroups}/>
    </div>
  );
};
UserGroups.authenticate = {
  permissions: adminOnly,
};
UserGroups.Layout = Layout;
export default UserGroups;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});

