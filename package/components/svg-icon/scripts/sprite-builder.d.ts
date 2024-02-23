import { IconList } from "./svg-list";
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
    private lists;
    private spriteName?;
    private GENERATED_DIR;
    constructor(lists: {
        [key: string]: IconList;
    }, spriteName?: string | undefined);
    static fromArguments(args: string[]): SvgSpriteBuilder;
    compileSvgSprites(): void;
    private generateSvgSprite;
    private generateAllSprites;
    private createSvgDocument;
    private appendSymbolToDoc;
    private serializeSvgDoc;
    private writeSpriteToFile;
}
//# sourceMappingURL=sprite-builder.d.ts.map