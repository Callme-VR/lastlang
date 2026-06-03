import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

export default function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();
  const handleSocialAuth = async (strategy: "oauth_google") => {
    if (loadingStrategy) return;
    // guard againt the possibility of multiple clicks on the social auth buttons, if there is already a loading strategy set, we return early to prevent multiple auth flows from being initiated simultaneously.

    setLoadingStrategy(strategy);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (!createdSessionId || !setActive) {
        Alert.alert("sign-in failed and completed without creating a session");
        return;
      }
      await setActive({ session: createdSessionId });
      console.log("Session created with ID:", createdSessionId);
    } catch (error) {
      console.error("Error during social authentication:", error);
      Alert.alert(
        "An error occurred during social authentication. Please try again.",
      );
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
}
