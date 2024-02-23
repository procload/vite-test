import fs from "fs";
import path from "path";
import { DOMParser, XMLSerializer } from "xmldom";
import { iconLists } from "./svg-list";
/**
 * SVG Sprite Generator
 *
 * This script facilitates the automated generation of SVG sprite sheets from individual SVG files.
 * Given a specified directory of SVG icon files and a configuration provided in `svg-list.ts`,
 * it constructs SVG sprite(s) which contain symbol elements for each icon.
 *
 * Functionalities Include:
 * - Parsing individual SVG files and converting them into <symbol> elements within a sprite SVG.
 * - Handling both single and multiple sprite generation based on provided arguments and configurations.
 * - Verifying configurations and icon lists for generation logic.
 * - Generating sprite sheet(s) with consideration to specified SVG icons in the configuration.
 *
 * Usage:
 * - Without arguments: Generates sprites for all configurations present in `svg-list.ts`.
 * - With arguments: Generates a specific sprite based on provided sprite name present in `svg-list.ts`.
 *
 * Example Usage:
 *   - No arguments: `yarn generate-sprite`
 *   - With arguments: `yarn generate-sprite [spriteName]`
 *
 * Important Notes:
 * - The script produces SVG sprite(s) in a designated output directory and logs respective paths upon successful generation.
 * - Ensure `svg-list.ts` is correctly structured and present as it is pivotal for the default functionality of the script.
 * - The sprite(s) are saved with a warning comment denoting auto-generation to deter manual edits.
 *
 */
export default class SvgSpriteBuilder {
    constructor(lists, spriteName) {
        this.lists = lists;
        this.spriteName = spriteName;
        this.GENERATED_DIR = path.resolve(__dirname, "../../../generated");
    }
    static fromArguments(args) {
        const [userSpriteName, userListsJson] = args;
        return new SvgSpriteBuilder(userListsJson ? JSON.parse(userListsJson) : iconLists, userSpriteName);
    }
    compileSvgSprites() {
        if (!this.lists || Object.keys(this.lists).length === 0) {
            console.error("Error: svg-list.ts is necessary for the script to function. Please ensure it exists and is properly structured.");
            process.exit(1);
        }
        if (this.spriteName) {
            const list = this.lists[this.spriteName];
            if (list) {
                this.generateSvgSprite(list, this.spriteName);
            }
            else {
                console.error(`Sprite with name ${this.spriteName} not found.`);
            }
        }
        else {
            this.generateAllSprites();
        }
    }
    generateSvgSprite(list, spriteName) {
        const svgDirPath = path.resolve(__dirname, list.rootPath);
        if (!fs.existsSync(this.GENERATED_DIR)) {
            fs.mkdirSync(this.GENERATED_DIR, { recursive: true });
        }
        const files = fs.readdirSync(svgDirPath);
        const svgDoc = this.createSvgDocument();
        files
            .filter((file) => path.extname(file) === ".svg" &&
            list.iconNames.includes(path.basename(file, ".svg")))
            .forEach((file) => {
            const filePath = path.resolve(svgDirPath, file);
            const svgContent = fs.readFileSync(filePath, "utf-8");
            const svgElement = new DOMParser().parseFromString(svgContent).documentElement;
            this.appendSymbolToDoc(svgDoc, svgElement, path.basename(file, ".svg"));
        });
        const outputPath = path.join(this.GENERATED_DIR, `${spriteName}.svg`);
        this.writeSpriteToFile(outputPath, this.serializeSvgDoc(svgDoc));
    }
    generateAllSprites() {
        for (const spriteName in this.lists) {
            const list = this.lists[spriteName];
            if (list) {
                this.generateSvgSprite(list, spriteName);
            }
            else {
                console.error(`No configuration found for sprite: ${spriteName}`);
            }
        }
    }
    createSvgDocument() {
        return new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    }
    appendSymbolToDoc(svgDoc, svgElement, id) {
        const symbolElement = svgDoc.createElementNS("http://www.w3.org/2000/svg", "symbol");
        symbolElement.setAttribute("id", id);
        symbolElement.setAttribute("viewBox", svgElement.getAttribute("viewBox") || "");
        while (svgElement.firstChild) {
            symbolElement.appendChild(svgElement.firstChild);
        }
        svgDoc.documentElement.appendChild(symbolElement);
    }
    serializeSvgDoc(svgDoc) {
        const serializer = new XMLSerializer();
        const generatedComment = "<!-- Generated file. Do not edit. -->\n";
        return generatedComment + serializer.serializeToString(svgDoc);
    }
    writeSpriteToFile(filePath, content) {
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`Successfully generated SVG sprite: ${filePath}`);
    }
}
if (require.main === module) {
    const builder = SvgSpriteBuilder.fromArguments(process.argv.slice(2));
    builder.compileSvgSprites();
}
//# sourceMappingURL=sprite-builder.js.map