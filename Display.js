import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ListItem } from "react-native-elements";
import bearerToken from "./Token";

export default function Display() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getDataFromSnowflake = async () => {
    try {
      const date = new Date();
      const response = await fetch('https://<SNOWFLAKE ACCOUNT>.snowflakecomputing.com/api/v2/statements', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Snowflake-Authorization-Token-Type': 'KEYPAIR_JWT',
        Authorization: 'Bearer ' + bearerToken()
        },
        body: JSON.stringify({
          "statement": "<SQL Query>",
          "timeout": 1200,
          "database": "<DATABASE>",
          "schema": "<SCHEMA>>",
          "warehouse": "<WAREHOUSE>",
          "role": "<ROLE>"
          }),
      });
      const json = await response.json();
      setData(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDataFromSnowflake();
  }, []);

  return (
    <View style={{ flex:1, backgroundColor: 'white'  }}>
      <View style={{ flex: 1, paddingLeft: 24, paddingRight: 24}}>
        <FlatList
          data={data}
          scrollEnabled={true}
          vertical
          title='Results'
          ListHeaderComponent={()=><Text style={{ fontWeight: '700', fontSize: 18, paddingTop: 15, color: '#11567F' }}>Results</Text>}
          ItemSeparatorComponent={() => {
            return (<View style={{ height: 1, backgroundColor: '#D9D9D9' }} />);
          }}
          renderItem={({item}) =>
            <ListItem>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '400' }}>
                { item[0] } {'\n'}
                { item[1] } {'\n'}
                { item[2] } 
                </Text>
              </View>
            </ListItem>
          }
        />
      </View>
  </View>
  );
};
