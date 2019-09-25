import React, { useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import socketIO from 'socket.io-client';

import LobbyForm from '../../components/LobbyForm';
import Lobby from '../../components/Lobby';

import { baseUrl } from '../../../config';
import { setNewLobby, getAllLobbies } from '../../actions/lobbies';

import styles from './styles';

function LobbyScreen({
  users,
  lobbies,
  setNewLobby: setNewLobbyAction,
  getAllLobbies: getAllLobbiesAction,
}) {
  const io = socketIO(baseUrl);

  useEffect(() => {
    io.emit('all-lobbies-request-from-client');
    io.on('all-lobbies-from-server', data => getAllLobbiesAction(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lobbyStyles = {
    lobbyContainer: styles.lobbyContainer,
    lobbyText: styles.lobbyText,
  };

  return (
    <ScrollView>
      <View style={styles.lobbyFormContainer}>
        {users.activeUser === null ? (
          <Text>Loading.........</Text>
        ) : (
          <>
            <Text style={styles.welcomeText}>
              {`Welcome ${users.activeUser.name}`}
            </Text>
            <LobbyForm io={io} setNewLobby={setNewLobbyAction} />
          </>
        )}
      </View>
      <View style={styles.lobbyListContainer}>
        {lobbies.lobbyList.length < 1 ? (
          <View>
            <Text>No lobbies</Text>
            <Text>Please create one to play</Text>
          </View>
        ) : (
          lobbies.lobbyList.map(({ id, name, score }) => (
            <Lobby id={id} name={name} score={score} styles={lobbyStyles} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = ({ users, lobbies }) => ({ users, lobbies });

export default connect(
  mapStateToProps,
  { setNewLobby, getAllLobbies },
)(LobbyScreen);