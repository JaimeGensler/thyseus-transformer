import { QueryDescriptor, Mut } from 'thyseus/descriptors';
function querySystem(query: Query<Mut<A>>) { }
querySystem.parameters = [QueryDescriptor(Mut(A))];
