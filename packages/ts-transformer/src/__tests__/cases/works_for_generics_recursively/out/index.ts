import { QueryDescriptor, Mut } from 'thyseus';
function querySystem(query: Query<Mut<A>>) { }
querySystem.parameters = [QueryDescriptor(Mut(A))];
