import React from 'react';
import {
  DataTable,
  Menu,
  MenuItem,
  IconButton,
  TableHeader,
  Textfield,
  Spinner
} from 'react-mdl';

const data = [
  { id: 1001,
    name: 'Yangwoo Lee',
    email: 'lyw0149@gmail.com',
    rating: 2.90,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left1' />
      <Menu target='demo-menu-lower-left1'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1002,
    name: 'Youngchan Je',
    email: 'ochanje210@gmail.com',
    rating: 1.25,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left2' />
      <Menu target='demo-menu-lower-left2'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1003,
    name: 'Yoonji Lee',
    email: 'yoonji.sophia.lee@gmail.com',
    rating: 2.35,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left3' />
      <Menu target='demo-menu-lower-left3'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1001,
    name: 'Yangwoo Lee',
    email: 'lyw0149@gmail.com',
    rating: 2.90,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1002,
    name: 'Youngchan Je',
    email: 'ochanje210@gmail.com',
    rating: 1.25,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1003,
    name: 'Yoonji Lee',
    email: 'yoonji.sophia.lee@gmail.com',
    rating: 2.35,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1001,
    name: 'Yangwoo Lee',
    email: 'lyw0149@gmail.com',
    rating: 2.90,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1002,
    name: 'Youngchan Je',
    email: 'ochanje210@gmail.com',
    rating: 1.25,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1003,
    name: 'Yoonji Lee',
    email: 'yoonji.sophia.lee@gmail.com',
    rating: 2.35,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1001,
    name: 'Yangwoo Lee',
    email: 'lyw0149@gmail.com',
    rating: 2.90,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1002,
    name: 'Youngchan Je',
    email: 'ochanje210@gmail.com',
    rating: 1.25,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1003,
    name: 'Yoonji Lee',
    email: 'yoonji.sophia.lee@gmail.com',
    rating: 2.35,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1001,
    name: 'Yangwoo Lee',
    email: 'lyw0149@gmail.com',
    rating: 2.90,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1002,
    name: 'Youngchan Je',
    email: 'ochanje210@gmail.com',
    rating: 1.25,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
  { id: 1003,
    name: 'Yoonji Lee',
    email: 'yoonji.sophia.lee@gmail.com',
    rating: 2.35,
    action: (<div style={{ position: 'relative' }}>
      <IconButton name='more_vert' id='demo-menu-lower-left' />
      <Menu target='demo-menu-lower-left'>
        <MenuItem>Some Action</MenuItem>
      </Menu>
    </div>) },
];

export default class UserList extends React.Component {


  renderSpinner() {
    // if (true) {
    return (<Spinner />);
    // }
    // return null;
  }

  render() {
    return (
      <div>
        <div style={{ width: '90%', margin: 'auto' }}>
          <h2> List of User</h2>
          <Textfield
            onChange={() => {}}
            label='Search'
            expandable
            expandableIcon='search'
          />

          <DataTable
            width='100%'
            selectable
            onSelectionChanged={() => {}}
            shadow={0}
            rowKeyColumn='id'
            rows={data}
          >
            <TableHeader name='name' tooltip='name of UserList'>Name</TableHeader>
            <TableHeader name='email' tooltip='email of user'>email</TableHeader>
            <TableHeader numeric name='rating' tooltip='rating of user.'>Rating</TableHeader>
            <TableHeader name='action' tooltip='Action for user.'>Action</TableHeader>
            {/* <TableHeader numeric name='rating' cellFormatter={price => `\$${price.toFixed(2)}`} tooltip='Price pet unit'>rating</TableHeader>*/}
          </DataTable>
        </div>
      </div>
    );
  }
}
