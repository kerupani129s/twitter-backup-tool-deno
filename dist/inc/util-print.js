// 
const encoder = new TextEncoder();

export const print = message => Deno.stdout.writeSync(encoder.encode(message));

// 
export const printCountDiff = (name, local, added, merged, removed = null, remote = null) => {

	print('\nCount of Previous Saved ' + name + ': ' + local + '\n');

	if ( removed !== null && remote !== null )
		print('Count of Remote ' + name + ': ' + local + ' + ' + added + ' - ' + removed + ' = ' + remote + '\n');

	print('Total Count of ' + name + ': ' + local + ' + ' + added + ' = ' + merged + '\n');

};
