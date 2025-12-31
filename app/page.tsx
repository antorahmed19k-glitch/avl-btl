
import { getSession } from './actions';
import ClientApp from '../App';

export default async function Page() {
  const session = await getSession();

  return (
    <ClientApp initialSession={session} />
  );
}
