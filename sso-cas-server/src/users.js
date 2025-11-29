const users = [
  {
    username: "nhu.nguyen",
    password: "123456",
    displayName: "Nguyễn Quỳnh Như"
  },
  {
    username: "mai.tran",
    password: "123456",
    displayName: "Nguyễn Trần Phương Mai"
  },
  {
    username: "thu.ngo",
    password: "123456",
    displayName: "Ngô Minh Thư"
  },
  {
    username: 'ngoc.le',
    password: '123456',
    name: 'Lê Hồng Ngọc'
  },
  {
    username: 'nghiem.trinh',
    password: '123456',
    name: 'Trịnh Duy Nghiêm'
  },
  {
    username: 'quan.truong',
    password: '123456',
    name: 'Trương Đỗ Anh Quân'
  },
  {
    username: 'huy.banh',
    password: '123456',
    name: ' Bành Huỳnh Minh Huy'
  },
  { 
    username: 'mdtrung',
    password: '123456',
    name: 'Mai Đức Trung'
  },

  {
    username: 'ldthuan',
    password: '123456',
    name: 'Lê Đình Thuận'
  },

  {
    username: 'ngoc.bui',
    password: '123456',
    name: 'Bùi Thế Ngọc'
  },

  {
    username: 'cong.tuan',
    password: '123456', 
    name: 'Công Tuấn'
  },

  {
    username: 'admin',
    password: '123456',
    name: 'Nguyễn Văn Admin'
  }
];

function findUser(username, password) {
  return users.find(
    (u) => u.username === username && u.password === password
  );
}

module.exports = {
  users,
  findUser
};
