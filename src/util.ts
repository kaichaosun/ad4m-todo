import { Ad4mClient } from '@perspect3vism/ad4m';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';

export function buildAd4mClient(server: string): Ad4mClient {
	let apolloClient = new ApolloClient({
		link: new WebSocketLink({
			uri: server,
			options: {
				reconnect: true,
				connectionParams: async () => {
					return {
						headers: {
							// authorization: "eyJhbGciOiJFUzI1NksifQ.eyJhcHBOYW1lIjoiZGVtby1hcHAiLCJhcHBEZXNjIjoiZGVtby1kZXNjIiwiYXBwVXJsIjoiZGVtby11cmwiLCJjYXBhYmlsaXRpZXMiOlsiQWdlbnRRdWVyeUNhcGFiaWxpdHkiLCJBZ2VudE11dGF0aW9uQ2FwYWJpbGl0eSJdLCJpYXQiOjE2NTI3NTM5NTEsImlzcyI6ImRpZDprZXk6elEzc2huSzFzQm51b3daZEJmWUgzYkRwVkxtRVFHZlpRYkhuTlFqM3RnQmRycWQ4TiIsImF1ZCI6ImRlbW8tYXBwOmRpZDprZXk6elEzc2huSzFzQm51b3daZEJmWUgzYkRwVkxtRVFHZlpRYkhuTlFqM3RnQmRycWQ4TiIsImV4cCI6MTY1MzM1ODc1MX0.wG9RKvDZ2A76PKJP1EPGKAIHqMB3XwjzK8jNBkEELPQv4lpr8EHUL0n-9wJryxCF9if7NJgIMvWlTB-nWtlADA"
							// authorization: "eyJhbGciOiJFUzI1NksifQ.eyJhcHBOYW1lIjoiZGVtby1hcHAiLCJhcHBEZXNjIjoiZGVtby1kZXNjIiwiYXBwVXJsIjoiZGVtby11cmwiLCJjYXBhYmlsaXRpZXMiOlsiQWdlbnRRdWVyeUNhcGFiaWxpdHkiLCJBZ2VudE11dGF0aW9uQ2FwYWJpbGl0eSJdLCJpYXQiOjE2NTI3NTk5MzMsImlzcyI6ImRpZDprZXk6elEzc2huSzFzQm51b3daZEJmWUgzYkRwVkxtRVFHZlpRYkhuTlFqM3RnQmRycWQ4TiIsImF1ZCI6ImRlbW8tYXBwOmRpZDprZXk6elEzc2huSzFzQm51b3daZEJmWUgzYkRwVkxtRVFHZlpRYkhuTlFqM3RnQmRycWQ4TiIsImV4cCI6MTY1Mjc1OTk1M30.LJ95AP7rwjtD-KAgmEUuMfiaujJud2XKy129Dm1y6ampHSV_xYyuPrxyV96YAVhkgmxRHupFzeE59LXCzdRwxA"
						}
					}
				}
			},
			webSocketImpl: WebSocket,
		}),
		cache: new InMemoryCache({ resultCaching: false, addTypename: false }),
		defaultOptions: {
			watchQuery: {
				fetchPolicy: "no-cache",
			},
			query: {
				fetchPolicy: "no-cache",
			}
		},
	});

	//@ts-ignore
	return new Ad4mClient(apolloClient);
}

export function buildAd4mClientJwt(server: string, jwt: string): Ad4mClient {
	let apolloClient = new ApolloClient({
		link: new WebSocketLink({
			uri: server,
			options: {
				reconnect: true,
				connectionParams: async () => {
					return {
						headers: {
							authorization: jwt
						}
					}
				}
			},
			webSocketImpl: WebSocket,
		}),
		cache: new InMemoryCache({ resultCaching: false, addTypename: false }),
		defaultOptions: {
			watchQuery: {
				fetchPolicy: "no-cache",
			},
			query: {
				fetchPolicy: "no-cache",
			}
		},
	});

	//@ts-ignore
	return new Ad4mClient(apolloClient);
}

export function uuid(): string {
	/*jshint bitwise:false */
	var i, random;
	var uuid = '';

	for (i = 0; i < 32; i++) {
		random = Math.random() * 16 | 0;
		if (i === 8 || i === 12 || i === 16 || i === 20) {
			uuid += '-';
		}
		uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
			.toString(16);
	}

	return uuid;
}

export function pluralize(count: number, word: string) {
	return count === 1 ? word : word + 's';
}

export function store(namespace: string, data?: any) {
	if (data) {
		return localStorage.setItem(namespace, JSON.stringify(data));
	}

	var store = localStorage.getItem(namespace);
	return (store && JSON.parse(store)) || [];
}

export function extend(...objs: any[]): any {
	var newObj = {};
	for (var i = 0; i < objs.length; i++) {
		var obj = objs[i];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				newObj[key] = obj[key];
			}
		}
	}
	return newObj;
}