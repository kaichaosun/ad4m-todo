import Login from './components/Login';
import './App.css';
import { useContext, useEffect, useState } from 'react';
import { ExceptionType } from '@perspect3vism/ad4m';
import { ExceptionInfo } from '@perspect3vism/ad4m/lib/src/runtime/RuntimeResolver';
import { Loader, Stack } from '@mantine/core';
import { Ad4mContext } from '.';

const App = () => {
  const ad4mClient = useContext(Ad4mContext);

  const [connected, setConnected] = useState(false);
  const [isLogined, setIsLogined] = useState<Boolean>(false);
  const [did, setDid] = useState("");
  const [candidate, setCandidate] = useState("");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await ad4mClient.runtime.hcAgentInfos(); // TODO runtime info is broken
        console.log("get hc agent infos success.");
        setConnected(true);
      } catch (err) {
        setConnected(false);
      }
    }

    checkConnection();

    console.log("Check if ad4m service is connected.")
  }, [ad4mClient]);

  const handleLogin = (login: Boolean, did: string) => {
    setIsLogined(login);
    setDid(did);

    if (login) {
      ad4mClient.runtime.addExceptionCallback((exception: ExceptionInfo) => {
        if (exception.type === ExceptionType.AgentIsUntrusted) {
          setCandidate(exception.addon!);
        }
        Notification.requestPermission()
          .then(response => {
            if (response === 'granted') {
              new Notification(exception.title, { body: exception.message })
            }
          });
        console.log(exception);
        return null
      })
    }
  }

  return (
    <div className="App">
      {!connected && (
        <Stack align="center" spacing="xl" style={{margin: "auto"}}>
          <Loader />
        </Stack>
      )}
      {connected && !isLogined && (
        <Stack align="center" spacing="xl" style={{margin: "auto"}}>
          <Login handleLogin={handleLogin} />
        </Stack>
      )}
      {isLogined && <p>DID: {did}</p>}
    </div>
  );
}

export default App;
