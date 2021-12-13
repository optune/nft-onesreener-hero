function testEvent (result, eventName, args) {
  values = Object.values(args)
  const mappedArgs = values.reduce(
    (currentArgs, nextValue, nextValueIndex) => ({
      ...currentArgs,
      [nextValueIndex]: nextValue,
    }),
    { __length__: values.length, ...args }
  );  
  
  assert.web3Event(
    result,
    {
      event: eventName,
      args: mappedArgs,
    },
    `The ${eventName} event is emitted`
  );
}

module.exports = {
  testEvent
}