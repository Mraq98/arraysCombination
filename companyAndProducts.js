import {getProducts, getUsers, getCompanies, getReviews} from "./api.js";
import Product from "./classes/Product.js";
import Company from "./classes/Company.js";
import Review from "./classes/Review.js";
import User from "./classes/User.js";

async function main() {
    const [productsData, usersData, companiesData, reviewsData] = await Promise.all([
        getProducts(),
        getUsers(),
        getCompanies(),
        getReviews(),
    ]);

    const users = [];
    for (const user of usersData) {
        users.push(new User(user.id, user.name));
    }

    const reviews = [];
    for (const review of reviewsData) {
        const user = users.find((u) => u.id === review.userId);
        reviews.push(new Review(review.id, user, review.text));
    }

    const products = [];
    for (const product of productsData) {
        const productReviews = reviews.filter((review) =>
            product.reviewIds.includes(review.id)
        );
        products.push(
            new Product(
                product.id,
                product.name,
                product.description,
                productReviews,
                product.companyId
            )
        );
    }

    const companies = [];
    for (const company of companiesData) {
        const companyProducts = products.filter((product) => product.companyId === company.id);
        companies.push(
            new Company(company.id, company.name, company.created, company.country, companyProducts)
        );
    }

    console.log(companies);
}

main();
