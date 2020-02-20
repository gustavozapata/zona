class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //creates a copy of the request.query object e.g. {duration: 7, price: 234}
    const queryObj = { ...this.queryString };

    //we don't want to include these (since they aren't actual properties of the User object)
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => delete queryObj[el]); //deletes page, sort, etc from the query object

    //Advance Filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    // let query = User.find(JSON.parse(queryStr)); //this is like: find({duration: 7, price: {gte: 100} })

    return this;
  }

  sort() {
    //Sort
    if (this.queryString) {
      const sort = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sort); //this is like: sort(price) | from the url: /users?sort=price
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    //Fields
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    //Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
