import './App.css';
import { FormikWithZod } from './components/FormikWithZod.tsx';
import { SimpleForm } from './components/SimpleForm.tsx';

function App() {
  return (
    <div>
      Subscribe to RoadsideCoder
      {/*<SimpleForm />*/}
      <FormikWithZod />
    </div>
  );
}

export default App;
