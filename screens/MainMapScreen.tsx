import { StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import React, { useState } from 'react';
import placesData from '../assets/resources/placesSample.json';
import PlaceDetail from './PlaceDetail';

const GOOGLE_PLACES_API_KEY = Constants.manifest?.ios?.config?.googleMapsApiKey || '';

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		...StyleSheet.absoluteFillObject,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginHorizontal: 20,
	},
	separator: {
		flexGrow: 0.3,
		// height: 50,
		width: '100%',
	},
	separatorText: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	map: {
		...StyleSheet.absoluteFillObject,
		marginVertical: 150,
	},
	list: {
		flexGrow: 0.7,
		marginVertical: 20,
		backgroundColor: 'white',
		width: '100%',
	},
	search: {
		marginVertical: 50,
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},
});

export default function MainMapScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
	const [places, setPlaces] = useState(placesData);

	const initialRegion = {
		latitude: 40.75251018277572,
		longitude: -73.97984077693457,
		latitudeDelta: 0.1,
		longitudeDelta: 0.1,
	};
	const [region, setRegion] = useState(initialRegion);

	const [showList, setShowList] = useState(false);

	return (
		<>
			<View style={styles.container}>
				<TouchableOpacity
					style={styles.separator}
					// lightColor="#eee"
					// darkColor="rgba(255,255,255,0.1)"
					onPress={() => {
						setShowList(!showList);
					}}
				>
					<Text style={styles.separatorText}>Toggle List</Text>
				</TouchableOpacity>
				<View style={styles.search}>
					<GooglePlacesAutocomplete
						placeholder="Search"
						query={{
							key: GOOGLE_PLACES_API_KEY,
							language: 'en',
						}}
						debounce={900}
						onPress={(data, details = null) => console.log('SEARCH DATA: ', data)}
						onFail={(error) => console.error('SEARCH ERROR: ', error)}
					/>
				</View>
				<MapView
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					showsUserLocation={true}
					initialRegion={initialRegion}
					onRegionChangeComplete={(region) => setRegion(region)}
				>
					{places.map((marker, index) => (
						<Marker
							key={index}
							coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
							title={marker.title}
							description={marker.description}
						/>
					))}
				</MapView>
				{showList && (
					<ScrollView style={styles.list}>
						{places.map((place, index) => (
							<Pressable
								key={index}
								onPress={() => {
									navigation.navigate('PlaceDetail', place);
								}}
							>
								<Text style={styles.title}>{place.name}</Text>
							</Pressable>
						))}
					</ScrollView>
				)}
			</View>
			{/* <View style={styles.container}>
        <Text style={styles.title}>Tab One</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="/screens/MainMapScreen.tsx" />
      </View> */}
		</>
	);
}
