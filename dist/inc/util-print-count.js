export const printCountOfTweets = (local, added, merged, removed = null, remote = null) => {

	console.log('Count of Previous Saved Tweets: ' + local);

	if ( removed !== null && remote !== null )
		console.log('Count of Remote Tweets: ' + local + ' + ' + added + ' - ' + removed + ' = ' + remote);

	console.log('Total Count of Tweets: ' + local + ' + ' + added + ' = ' + merged);

};

export const printCountOfUsers = (local, added, merged, removed = null, remote = null) => {

	console.log('Count of Previous Saved Users: ' + local);

	if ( removed !== null && remote !== null )
		console.log('Count of Remote Users: ' + local + ' + ' + added + ' - ' + removed + ' = ' + remote);

	console.log('Total Count of Users: ' + local + ' + ' + added + ' = ' + merged);

};

export const printCountOfLists = (local, added, merged, removed = null, remote = null) => {

	console.log('Count of Previous Saved Lists: ' + local);

	if ( removed !== null && remote !== null )
		console.log('Count of Remote Lists: ' + local + ' + ' + added + ' - ' + removed + ' = ' + remote);

	console.log('Total Count of Lists: ' + local + ' + ' + added + ' = ' + merged);

};
