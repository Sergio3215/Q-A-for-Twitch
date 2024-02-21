import pregunta from '../preguntas.json'

export function GET() {
    // console.log(pregunta);
    return Response.json({pregunta: pregunta});
}