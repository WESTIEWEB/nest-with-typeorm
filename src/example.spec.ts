class Car {
  constructor(public color: string, public name: string) {
    this.color = color;
    this.name = name;
  }

  driveCar() {
    this.drive();
  }

  drive(): void {
    console.log(`the ${this.name} drove vroom of the party`);
  }
}

type ListNode<T> = {
  value: T;
  next?: ListNode<T>;
};

class FriendList {
  public length: number;
  private head?: ListNode<string>;
  private tail?: ListNode<string>;
  private friends: Array<string> = [];

  constructor() {
    this.length = this.friends.length;
    this.head = undefined;
    this.tail = undefined;
  }

  addFriends(name: string): void {
    const node: ListNode<string> = { value: name };
    this.friends.push(name);
    console.log(this.friends.length);
    this.length++;

    this.announceFriends(name);

    if (!this.tail) {
      this.tail = this.head = node;
      //   this.tail = this.head;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
  }

  removeFriend(name: string): void {
    if (this.friends.length === 0) {
      throw new Error(`friend list is empty`);
    }
    const index = this.friends.indexOf(name);
    if (index === -1) {
      throw new Error(`friend ${name} does not exist`);
    } else {
      this.friends.splice(index, 1);
      this.length--;

      this.announceRemoval(name);
    }
  }

  dequeue(): string | undefined {
    if (!this.head) {
      return;
    }
    this.friends.length--;

    const head = this.head;
    this.head = this.head.next;

    //free up memory
    head.next = undefined;

    this.announceRemoval(head.value);

    return head.value;
  }

  getHead(): string | undefined {
    return this.head?.value;
  }

  printFriendList(): Array<string> {
    return this.friends;
  }

  announceFriends(name?: string): void {
    global.console.log(`Hello ${name}!, welcome to the party`);
  }

  announceRemoval(name?: string): void {
    if (!name) {
      console.log(
        `Hello ${this.friends[0]}! you have been removed from the party`,
      );
    }
    console.log(`Hello ${name}! you have been removed from the party`);
  }
}

// const friendList = new FriendList();
// friendList.addFriends('mary');
// friendList.addFriends('Jane');
// friendList.addFriends('Jack');
// friendList.addFriends('John');
// console.log(friendList.dequeue());
// console.log(friendList.getHead());
// console.log(friendList.printFriendList());

describe('example test', () => {
  it('should return truthy', () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(4, 6)).toEqual(4 + 6);
  });
});

describe('Car', () => {
  it('can drive', () => {
    const car = new Car('red', 'toyota');
    expect(car.color).toEqual('red');
  });

  it('should console how the car drove', () => {
    const car = new Car('pink', 'lexuz');
    car.drive = jest.fn();
    car.driveCar();
    expect(car.drive).toHaveBeenCalled();
  });
});

describe('FriendList', () => {
  let friendList: FriendList;

  beforeEach(() => {
    friendList = new FriendList();
  });
  it('check the length of the list', () => {
    friendList.addFriends('mary');
    expect(friendList.length).toBe(1);
  });

  it('it describe the  friendList', () => {
    const friendList = new FriendList();
    friendList.addFriends('mary');
    friendList.addFriends('Jane');
    friendList.addFriends('Jack');
    friendList.addFriends('John');
    expect(Array.isArray(friendList.printFriendList())).toBe(true);
  });

  it('announceFriends', () => {
    const friendlist = new FriendList();
    friendlist.announceFriends = jest.fn();

    expect(friendlist.announceFriends).not.toHaveBeenCalled();

    friendlist.addFriends('chibuike');
    // expect(friendlist.announceFriends).toHaveBeenCalled();
    expect(friendlist.announceFriends).toHaveBeenCalledWith('chibuike');
  });

  it('announceRemoval', () => {
    friendList.announceRemoval = jest.fn();
    friendList.addFriends('chibuike');
    friendList.removeFriend('chibuike');
    expect(friendList.announceRemoval).toHaveBeenCalled();
  });

  it('throws error when friend does not exist', () => {
    expect(() => friendList.removeFriend('chibuike')).toThrow(Error);
  });
});
