import chai from "chai";
import getJson from "../../src/task-1.js";

const assert = chai.assert;

function jsonResult(obj) {
    return new window.Response(JSON.stringify(obj), {
        status: 200,
        headers: {
            "Content-type": "application/json"
        }
    });
}

describe("Task 1: getJson", () => {
    beforeEach(() => {
        // sinon.stub(window, "fetch");
    });

    afterEach(() => {
        // window.fetch.restore();
    });

    it("should return Promise", () => {
        sinon.stub(window, "fetch");
        getJson("/test").catch(e => console.log(e));

        assert.instanceOf(getJson("//test"), Promise);
    });

    it("should correctly parse JSON response", () => {
        sinon.stub(window, "fetch");
        window.fetch.returns(Promise.resolve(jsonResult({
            hello: "world",
            world: "hello"
        })));

        getJson("/test").then(data => {
            assert.equal(data.hello, "world");
            assert.equal(data.world, "hello");
        }).catch(() => {
            assert.fail();
        });
    });
});
