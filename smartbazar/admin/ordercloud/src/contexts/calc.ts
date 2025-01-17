const MinDays = 30;
const MaxDays = 70;
const numOfDaysSmallBag = 0;
const numOfDaysMediumBag = 0;
const numOfDaysLargeBag = 0;
const numOfLargeBags = 0;

enum PET_SIZE {
  S = 'S',
  M = 'M',
  L = 'L',
  E = 'E',
}

type PetSize = keyof typeof PET_SIZE;

const WEIGHT_LIMITS = {
  [PET_SIZE.S]: 60,
  [PET_SIZE.M]: 100,
  [PET_SIZE.L]: 200,
  [PET_SIZE.E]: 200,
};

const WEIGHT_ERROR_MESSAGES = {
  [PET_SIZE.S]: 'Small puppy weight should be up to 60 lbs',
  [PET_SIZE.M]: 'More than 6 months puppy weight should be up to 100 lbs',
  [PET_SIZE.L]: 'Adult pets weight should be up to 200 lbs',
  [PET_SIZE.E]: 'Pet weight should be up to 200 lbs',
};

type Pet = {
  size: PetSize;
  weight: number;
};

class PetFoodCalculator {
  private _pets: Pet[] = [];
  public isCalculateBtnVisible = false;

  addPet(weight: number, size: PetSize) {
    if (!weight && !size) {
      return 'Please fill the age and weight before adding a pet';
    }

    if (weight > WEIGHT_LIMITS[size]) {
      return WEIGHT_ERROR_MESSAGES[size];
    }

    if (this._pets.length >= 10) {
      return 'You can only add up to 10 pets';
    }

    this._pets.push({
      size,
      weight,
    });
  }

  removePet(id: number) {
    this._pets = this._pets.filter((_pet, index) => index !== id);
  }
}

function removePet(el) {
  $(el).closest('.pet-item').remove();

  var itemCount = $('.original').data('count') - 1;
  var resultsDiv = $('.bag-size-results');

  var calculateBtn = $('.btn-calculate');

  if (itemCount == 0) {
    $(calculateBtn).addClass('d-none');
  } else {
    $(calculateBtn).removeClass('d-none');
  }

  $('.original').data('count', itemCount);

  $('.error').addClass('d-none');

  $(resultsDiv).hide();
}
