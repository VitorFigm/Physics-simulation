import { Controller, View } from "@app/models";

/**
 * This controller will position the fighter such that it will not
 * be coliding with the enemy anymore, and will keep the same angle
 * it had before in respect to his enemy
*/
export const avoidStuckedFighter: Controller = (fighterView: View, enemyView: View) => {
  const margin = 0.2 /// the 'distance' that the fighter will be from the enemy in each direction

  const newXPosition = defineNewXPosition()
  const newYPosition = defineNewYPosition(newXPosition)
  
  
  fighterView.position.x = newXPosition
  fighterView.position.y = newYPosition

  console.log(newYPosition);
  

  function defineNewXPosition(){
    const possibleXPosition1 = enemyView.position.x -fighterView.width - margin
    const possibleXPosition2 = enemyView.position.x + enemyView.width + margin

    const delta1 = Math.abs(possibleXPosition1 - fighterView.position.x)
    const delta2 = Math.abs(possibleXPosition2 - fighterView.position.x)
    
    return delta1 < delta2 ? possibleXPosition1 : possibleXPosition2
  }

  /**
   * This function will try to keep the angle between the fighter the same as before
  */

  function defineNewYPosition(newXPosition: number){
    const scaler = newXPosition/fighterView.position.x
    const diference = fighterView.position.y - enemyView.position.y
    return enemyView.position.y + diference*scaler
  }
}