class FriendList {
  list: string[] = [];

  addFriend(name: string) {
    this.list.push(name);
    this.announceFriend(name);
  }

  announceFriend(name) {
    global.console.log(name);
  }

  removeFriend(name) {
    const idx = this.list.indexOf(name);
    if (idx === -1) {
      throw new Error('not found', { cause: 'Not Found' });
    }

    this.list.splice(idx, 1);
  }
}

describe('Friend List', () => {
  let flist;

  beforeEach(() => {
    flist = new FriendList();
  });
  it('initialize class', () => {
    expect(flist.list.length).toBe(0);
  });

  it('add a friend', () => {
    flist.addFriend('Huzaifa');
    expect(flist.list.length).toBe(1);
  });

  it('annnounce a friedn', () => {
    flist.announceFriend = jest.fn();
    expect(flist.announceFriend).not.toHaveBeenCalled();
    flist.addFriend('Huzaifa');
    expect(flist.announceFriend).toHaveBeenCalledWith('Huzaifa');
  });

  describe('removeFriend', () => {
    it('remove a friedn ', () => {
      flist.addFriend('Huzaifa');
      expect(flist.list[0]).toEqual('Huzaifa');
      flist.removeFriend('Huzaifa');
      expect(flist.list[0]).toBeUndefined();
    });
    it('not found throw error', () => {
      expect(() => flist.removeFriend('Huzaifa')).toThrow();
    });
  });
});
