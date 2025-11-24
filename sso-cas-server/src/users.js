const users = [
  {
    username: "nhu.nguyen@hcmut.edu.vn",
    password: "123456",
    displayName: "Nguyễn Quỳnh Như"
  },
  {
    username: "mai.tran@hcmut.edu.vn",
    password: "123456",
    displayName: "Nguyễn Trần Phương Mai"
  },
  {
    username: "thu.ngo@hcmut.edu.vn",
    password: "123456",
    displayName: "Ngô Minh Thư"
  },
  {
    username: 'ngoc.le@hcmut.edu.vn',
    password: '123456',
    name: 'Lê Hồng Ngọc'
  },
  {
    username: 'nghiem.trinh@hcmut.edu.vn',
    password: '123456',
    name: 'Trịnh Duy Nghiêm'
  },
  {
    username: 'quan.truong@hcmut.edu.vn',
    password: '123456',
    name: 'Trương Đỗ Anh Quân'
  },
  {
    username: 'huy.banh@hcmut.edu.vn',
    password: '123456',
    name: ' Bành Huỳnh Minh Huy'
  },
  { 
    username: 'mdtrung@hcmut.edu.vn',
    password: '123456',
    name: 'Mai Đức Trung'
  },

  {
    username: 'ldthuan@hcmut.edu.vn',
    password: '123456',
    name: 'Lê Đình Thuận'
  },

  {
    username: 'ngoc.bui@hcmut.edu.vn',
    password: '123456',
    name: 'Bùi Thế Ngọc'
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
